import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types";

import { prisma } from "@/prisma";

import type { HistoryPrediction, Prediction, PredictionDetail } from "./predict.routes";

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
      id: predict.id,
      user_id: predict.user_id,
      temp: predict.temp,
      precip: predict.precip,
      humidity: predict.humidity,
      windspeed: predict.windspeed,
      uvindex: predict.uvindex,
      dew: predict.dew,
      hour: predict.hour,
      power: predict.power,
      range: predict.range,
      predicted_visibility: predict.predicted_visibility,
      predicted_condition_code: predict.predicted_condition_code,
      predicted_condition_label: predict.predicted_condition_label,
      attenuation: predict.attenuation,
      q_value: predict.q_value,
      ber_prediction: predict.ber_prediction,
      status: predict.status,
      category: predict.category,
      created_at: predict.created_at,
      updated_at: predict.updated_at,

    }),
  );
  return c.json(pred, HttpStatusCodes.OK);
};

export const getOneHistory: AppRouteHandler<PredictionDetail> = async (c) => {
  const { id } = c.req.valid("param");

  const history = await prisma.prediction.findUnique({
    where: {
      id,
    },
  });
  if (!history) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }
  const data = {
    id: history.id,
    user_id: history.user_id,
    temp: history.temp,
    precip: history.precip,
    humidity: history.humidity,
    windspeed: history.windspeed,
    uvindex: history.uvindex,
    dew: history.dew,
    hour: history.hour,
    power: history.power,
    range: history.range,
    predicted_visibility: history.predicted_visibility,
    predicted_condition_code: history.predicted_condition_code,
    predicted_condition_label: history.predicted_condition_label,
    attenuation: history.attenuation,
    q_value: history.q_value,
    ber_prediction: history.ber_prediction,
    status: history.status,
    category: history.category,
    created_at: history.created_at,
    updated_at: history.updated_at,
  };

  return c.json(data, HttpStatusCodes.OK);
};

export const predictAll: AppRouteHandler<Prediction> = async (c) => {
  const {
    temp,
    precip,
    humidity,
    windspeed,
    uvindex,
    dew,
    hour,
    power,
    range,
  } = c.req.valid("json");

  const userId = c.get("userId");

  if (!userId) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED,
    );
  }

  const initialPredict = await prisma.prediction.create({
    data: {
      user_id: userId,
      temp,
      precip,
      humidity,
      windspeed,
      uvindex,
      dew,
      hour,
      power,
      range,
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
        power,
        range,
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
          status: "failed",
        },
      });
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

    let category = null;

    if (ber_prediction <= -12) {
      category = "optimal";
    }
    else if (ber_prediction <= -9 && ber_prediction > -12) {
      category = "maintenance";
    }
    else if (ber_prediction > -9) {
      category = "repairing";
    }

    let status = "success";

    if (ber_prediction === null) {
      status = "error";
    }

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
        status,
        category,
      },
    });

    const data = {
      id: prediction.id,
      user_id: prediction.user_id,
      temp: prediction.temp,
      precip: prediction.precip,
      humidity: prediction.humidity,
      windspeed: prediction.windspeed,
      uvindex: prediction.uvindex,
      dew: prediction.dew,
      hour: prediction.hour,
      power: prediction.power,
      range: prediction.range,
      predicted_visibility: prediction.predicted_visibility,
      predicted_condition_code: prediction.predicted_condition_code,
      predicted_condition_label: prediction.predicted_condition_label,
      attenuation: prediction.attenuation,
      q_value: prediction.q_value,
      ber_prediction: prediction.ber_prediction,
      status: prediction.status,
      category: prediction.category,
      created_at: prediction.created_at,
      updated_at: prediction.updated_at,
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
