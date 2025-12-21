import React, {
  ReactNode, useEffect
} from "react";
import {
  FieldValues,
  Controller,
  useFormState
} from "react-hook-form";
import SpeechRecognition from "react-speech-recognition";
import { SpeechInputProps } from "./NumberToText";
import get from "lodash/get";
import { useSpeech } from "./SpeechContext";

export default function InputNumberVoice<T extends FieldValues>({
  label,
  name,
  placeholder,
  control,
  disable = false,
  require = false
}: SpeechInputProps<T>): React.JSX.Element {
  const { errors } = useFormState({ control });
  const error = get(errors, name);
  const { activeField, transcript, startListening, stopListening } = useSpeech();

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <p>Your browser does not support speech recognition.</p>;
  }

  return (
    <div className="mb-3">
      {label && <label className="form-label fw-bold">{label} {require && <span className="text-danger"> *</span>}</label>}

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
          render={({ field }) => {

            // Apply transcript ONLY to this specific field when it's active
            useEffect(() => {
              if (activeField === name && transcript) {
                field.onChange(transcript);
              }
            }, [transcript, activeField, name]);

            return (
              <>
                <input
                  type="number"
                  className={`form-control ${error ? 'is-invalid' : ''}`}
                  placeholder={placeholder}
                  {...field}
                  onFocus={() => {
                    if (activeField && activeField !== name) {
                      stopListening();
                    }
                  }}
                  onBlur={() => {
                    if (activeField === name) {
                      stopListening();
                    }
                  }}
                />

                {activeField !== name ? (
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => startListening(name)}
                  >
                    🎤
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => stopListening()}
                  >
                    ⛔
                  </button>
                )}
              </>
            );
          }}
        />
      </div>
      {error && <p className="invalid-feedback d-block">{error.message as ReactNode}</p>}
    </div>
  );
}
