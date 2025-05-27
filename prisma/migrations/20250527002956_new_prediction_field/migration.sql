/*
  Warnings:

  - You are about to drop the column `input_params` on the `prediction` table. All the data in the column will be lost.
  - You are about to drop the column `weather_condition` on the `prediction` table. All the data in the column will be lost.
  - Added the required column `Power` to the `Prediction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Range` to the `Prediction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `attenuation` to the `Prediction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dew` to the `Prediction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hour` to the `Prediction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `humidity` to the `Prediction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precip` to the `Prediction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `predicted_condition_code` to the `Prediction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `predicted_condition_label` to the `Prediction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `predicted_visibility` to the `Prediction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `q_value` to the `Prediction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `temp` to the `Prediction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uvindex` to the `Prediction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `windspeed` to the `Prediction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `prediction` DROP COLUMN `input_params`,
    DROP COLUMN `weather_condition`,
    ADD COLUMN `Power` DOUBLE NOT NULL,
    ADD COLUMN `Range` DOUBLE NOT NULL,
    ADD COLUMN `attenuation` DOUBLE NOT NULL,
    ADD COLUMN `dew` DOUBLE NOT NULL,
    ADD COLUMN `hour` INTEGER NOT NULL,
    ADD COLUMN `humidity` DOUBLE NOT NULL,
    ADD COLUMN `precip` DOUBLE NOT NULL,
    ADD COLUMN `predicted_condition_code` INTEGER NOT NULL,
    ADD COLUMN `predicted_condition_label` VARCHAR(191) NOT NULL,
    ADD COLUMN `predicted_visibility` DOUBLE NOT NULL,
    ADD COLUMN `q_value` DOUBLE NOT NULL,
    ADD COLUMN `temp` DOUBLE NOT NULL,
    ADD COLUMN `uvindex` DOUBLE NOT NULL,
    ADD COLUMN `windspeed` DOUBLE NOT NULL;
