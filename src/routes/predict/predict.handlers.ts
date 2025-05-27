import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types";

import { prisma } from "@/prisma";

import type { HistoryPrediction, Prediction } from "./predict.routes";

export const getHistory: AppRouteHandler<HistoryPrediction> = async (c) => {
  const userId = c.get("userId");
  const predicts = await prisma.prediction.findMany({
    where: {
      user_id: userId,
    },
  });

  if (!predicts) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  const pred = predicts.map(
    predict => ({
      user_id: predict.user_id,
      temp: predict.temp,
      precip: predict.precip,
      humidity: predict.humidity,
      windspeed: predict.windspeed,
      uvindex: predict.uvindex,
      dew: predict.dew,
      hour: predict.hour,
      Power: predict.Power,
      Range: predict.Range,
      predicted_visibility: predict.predicted_visibility,
      predicted_condition_code: predict.predicted_condition_code,
      predicted_condition_label: predict.predicted_condition_label,
      attenuation: predict.attenuation,
      q_value: predict.q_value,
      ber_prediction: predict.ber_prediction,
      status: predict.status,

    }),
  );
  return c.json(pred, HttpStatusCodes.OK);
};

export const predictAll: AppRouteHandler<Prediction> = async (c) => {
  const {
    user_id,
    temp,
    precip,
    humidity,
    windspeed,
    uvindex,
    dew,
    hour,
    Power,
    Range,
  } = c.req.valid("json");

  const initialPredict = await prisma.prediction.create({
    data: {
      user_id,
      temp,
      precip,
      humidity,
      windspeed,
      uvindex,
      dew,
      hour,
      Power,
      Range,
      predicted_visibility: null,
      predicted_condition_code: null,
      predicted_condition_label: null,
      attenuation: null,
      q_value: null,
      ber_prediction: null,
      status: "pending",
    },
  });

  try {
    // Send input to Flask API
    const flaskRes = await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        temp,
        precip,
        humidity,
        windspeed,
        uvindex,
        dew,
        hour,
        Power,
        Range,
      }),
    });

    if (!flaskRes.ok) {
      const errorText = await flaskRes.text();
      c.var.logger.error("Flask API error:", errorText);
      await prisma.prediction.update({
        where: {
          id: initialPredict.id,
        },
        data: {
          status:"failed",
        }
      })
      return c.json(
        { message: "Failed to fetch prediction from Flask API" },
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    const predictionResult = await flaskRes.json();

    const {
      predicted_visibility,
      predicted_condition_code,
      predicted_condition_label,
      attenuation,
      q_value,
      ber_prediction,
    } = predictionResult;

    // Store the result in the database
    const prediction = await prisma.prediction.update({
      where: {
        id: initialPredict.id,
      },
      data: {
        predicted_visibility,
        predicted_condition_code,
        predicted_condition_label,
        attenuation,
        q_value,
        ber_prediction,
        status: "success",
      },
    });

    const data = {
      user_id: prediction.user_id,
      temp: prediction.temp,
      precip: prediction.precip,
      humidity: prediction.humidity,
      windspeed: prediction.windspeed,
      uvindex: prediction.uvindex,
      dew: prediction.dew,
      hour: prediction.hour,
      Power: prediction.Power,
      Range: prediction.Range,
      predicted_visibility: prediction.predicted_visibility,
      predicted_condition_code: prediction.predicted_condition_code,
      predicted_condition_label: prediction.predicted_condition_label,
      attenuation: prediction.attenuation,
      q_value: prediction.q_value,
      ber_prediction: prediction.ber_prediction,
      status: prediction.status,
    };

    return c.json(data, HttpStatusCodes.CREATED);
  }
  catch (error) {
    c.var.logger.error({ error }, "Prediction failed");
    return c.json(
      {
        message: HttpStatusPhrases.INTERNAL_SERVER_ERROR,
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};
