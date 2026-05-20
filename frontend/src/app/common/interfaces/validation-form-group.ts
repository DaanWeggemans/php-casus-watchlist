import { ValidatorFn } from "@angular/forms"
import { ObjectArray } from "../types/object-array"

export interface ValidationValidators extends ObjectArray<string, [string | boolean | null, ValidationValidator[]]> { }

export interface ValidationValidator {
    validator: ValidatorFn,
    type?: string
    message?: string
}