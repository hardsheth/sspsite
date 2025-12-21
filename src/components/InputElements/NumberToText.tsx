import React, { ReactNode, useState } from "react";
import { toWords } from "number-to-words";
import { Control, Controller, FieldValues, Path, useFormContext, useFormState } from "react-hook-form";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { get } from "lodash";

export type SpeechInputProps<T extends FieldValues> = {
    label?: string;
    name: Path<T>;
    placeholder?: string;
    control: Control<T>;
    require?: boolean;
    disable?: boolean;
};

export default function NumberToText<T extends FieldValues>({
    label,
    name,
    placeholder,
    control,
    require = false,
    disable = false,
}: SpeechInputProps<T>) {
    const { watch } = useFormContext()
    const { errors } = useFormState({ control });
    const error = get(errors, name);
    const value = watch(name);
    const { transcript, resetTranscript } = useSpeechRecognition();

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return <p>Your browser does not support speech recognition.</p>;
    }

    return (
        <div>
            <div className="mb-3">
                {label && <label className="form-label fw-bold">{label} <span className="text-danger"> *</span></label>}

                <div className="input-group">
                    <Controller
                        name={name}
                        control={control}
                        rules={require ? {
                            required: {
                                value: require,
                                message: `${label || name} is required`
                            }
                        } : {}}
                        render={({ field }) => (
                            <>
                                <input
                                    type="number"
                                    className={`form-control ${error ? 'is-invalid' : ''}`}
                                    placeholder={placeholder}
                                    {...field}
                                    value={transcript || field.value}
                                    disabled={disable}
                                />
                            {/* {!isActive.current? (
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary"
                                        onClick={() => SpeechRecognition.startListening({ continuous: true })}
                                        disabled={disable}
                                    >
                                        🎤
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger"
                                        onClick={SpeechRecognition.stopListening}
                                        disabled={disable}
                                    >
                                        ⛔
                                    </button>
                                )} */}
                            </>
                        )}
                    />
                </div>
                {error && <p className="invalid-feedback d-block">{error.message as ReactNode}</p>}
                {<p>In Words: {value && toWords(value)}</p>}
            </div>
        </div>
    );
}
