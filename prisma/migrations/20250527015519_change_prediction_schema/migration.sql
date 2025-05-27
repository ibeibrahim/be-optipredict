-- AlterTable
ALTER TABLE `prediction` MODIFY `ber_prediction` DOUBLE NULL,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    MODIFY `attenuation` DOUBLE NULL,
    MODIFY `predicted_condition_code` INTEGER NULL,
    MODIFY `predicted_condition_label` VARCHAR(191) NULL,
    MODIFY `predicted_visibility` DOUBLE NULL,
    MODIFY `q_value` DOUBLE NULL;
