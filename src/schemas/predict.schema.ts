import { z } from "@hono/zod-openapi";

export const PredictRequestSchema = z.object({
  user_id: z.number().openapi({ description: "User Id that send the request", example: 1 }),
  temp: z.number().min(-50).max(100).openapi({ description: "Air temperature in Celsius", example: 26.2 }),
  precip: z.number().min(0).openapi({ description: "Precipitation level in mm/hr", example: 0 }),
  humidity: z.number().min(0).max(100).openapi({ description: "Relative humidity percentage", example: 86.85 }),
  windspeed: z.number().min(0).openapi({ description: "Wind speed in km/h", example: 8.2 }),
  uvindex: z.number().min(0).max(15).openapi({ description: "UV Index value", example: 0 }),
  dew: z.number().openapi({ description: "Dew point temperature in Celsius", example: 23.8 }),
  hour: z.number().min(0).max(23).openapi({ description: "Hour of the day in 24-hour format", example: 8 }),
  Power: z.number().min(0).openapi({ description: "Transmission power in dBm", example: 9 }),
  Range: z.number().min(0).openapi({ description: "Transmission range in km", example: 4 }),
});

export const VisibilityConditionsRequestSchema = z.object({
  temp: z.number().openapi({ description: "Temperature in Celsius", example: 26.2 }),
  precip: z.number().openapi({ description: "Precipitation in mm/hr", example: 0 }),
  humidity: z.number().openapi({ description: "Humidity in %", example: 86.85 }),
  windspeed: z.number().openapi({ description: "Wind speed in km/h", example: 8.2 }),
  uvindex: z.number().openapi({ description: "UV Index", example: 0 }),
  dew: z.number().openapi({ description: "Dew point in Celsius", example: 23.8 }),
  hour: z.number().int().min(0).max(23).openapi({ description: "Hour of the day", example: 8 }),
});

export const BERRequestSchema = z.object({
  visibility: z.number().min(0).openapi({ description: "Predicted visibility in km", example: 10.5 }),
  q: z.number().min(0).openapi({ description: "q value calculated from visibility", example: 1.3 }),
  Attenuation: z.number().min(0).openapi({ description: "Computed attenuation", example: 0.12 }),
  Power: z.number().openapi({ description: "Transmission power in dBm", example: 9 }),
  Range: z.number().openapi({ description: "Transmission range in km", example: 4 }),
});

export const VisibilityResponseSchema = z.object({
  visibility: z.number().openapi({
    description: "Predicted visibility in km",
    example: 10.5,
  }),
});

export const ConditionsResponseSchema = z.object({
  predicted_conditions: z.number().int().openapi({
    description: "Predicted weather condition label ID",
    example: 6,
  }),
  condition_label: z.string().openapi({
    description: "Descriptive weather condition label",
    example: "clear-day",
  }),
});

export const BERResponseSchema = z.object({
  ber_prediction: z.number().openapi({
    description: "Predicted Bit Error Rate",
    example: 0.00000213,
  }),
});

export const PredictionResponseSchema = z.object({
  user_id: z.number().int().openapi({ description: "User ID" }),
  // Input parameters
  temp: z.number().openapi({ description: "Temperature" }),
  precip: z.number().openapi({ description: "Precipitation" }),
  humidity: z.number().openapi({ description: "Humidity" }),
  windspeed: z.number().openapi({ description: "Wind speed" }),
  uvindex: z.number().openapi({ description: "UV index" }),
  dew: z.number().openapi({ description: "Dew point" }),
  hour: z.number().int().openapi({ description: "Hour of day" }),
  Power: z.number().openapi({ description: "Power" }),
  Range: z.number().openapi({ description: "Range" }),

  // Prediction results
  predicted_visibility: z.number().nullable().openapi({ description: "Predicted visibility" }),
  predicted_condition_code: z.number().int().nullable().openapi({ description: "Predicted weather condition code" }),
  predicted_condition_label: z.string().nullable().openapi({ description: "Predicted weather condition label" }),
  attenuation: z.number().nullable().openapi({ description: "Attenuation value" }),
  q_value: z.number().nullable().openapi({ description: "Q value" }),
  ber_prediction: z.number().nullable().openapi({ description: "Predicted Bit Error Rate" }),

  status: z.string().openapi({ description: "Status of the prediction, e.g. 'success'" }),
});
