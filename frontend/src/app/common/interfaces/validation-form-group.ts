import { ValidatorFn } from "@angular/forms"
import { ObjectArray } from "../types/object-array"

export type ValidationType = string | boolean | number | null;

export interface ValidationValidators extends ObjectArray<string, [ValidationType, ValidationValidator[]]> { }

export interface ValidationValidator {
    validator: ValidatorFn,
    type?: string
    message?: string
}