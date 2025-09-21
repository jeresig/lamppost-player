import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";

import type {
    WidgetChoiceProps,
    WidgetHistoryProps,
    WidgetRegistry,
} from "../shared/types";

const renderTextInputLogView = ({
    input: { label },
    output,
}: WidgetHistoryProps) => {
    return `<p>&raquo; <strong>${label ? `${label} ` : ""}${output?.value || "[Empty Text Input]"}</strong></p>`;
};

function TextInputHistory({ input: { label }, output }: WidgetHistoryProps) {
    return (
        <p>
            &raquo;{" "}
            <strong>
                {label ? `${label} ` : ""}
                {output?.value || "[Empty Text Input]"}
            </strong>
        </p>
    );
}

function TextInput({ input, onCompletion, autoFocus }: WidgetChoiceProps) {
    const { name, label, submitLabel } = input;
    const inputRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState("");

    const handleSubmit = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const value = inputRef.current?.value ?? "";
            if (value) {
                onCompletion({
                    output: { value },
                    variables: { [name]: value },
                });
            }
        },
        [onCompletion, name],
    );

    const handleChange = useCallback(() => {
        setValue(inputRef.current?.value ?? "");
    }, []);

    useEffect(() => {
        if (autoFocus) {
            inputRef.current?.focus();
        }
    }, [autoFocus]);

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
                {label && (
                    <Form.Label htmlFor={name} className="fw-bold">
                        {label}
                    </Form.Label>
                )}
                <Stack direction="horizontal" gap={2}>
                    <Form.Control
                        type="text"
                        id={name}
                        name={name}
                        ref={inputRef}
                        onChange={handleChange}
                        autoComplete="off"
                    />
                    <Button type="submit" disabled={!value}>
                        {submitLabel || "Submit"}
                    </Button>
                </Stack>
            </Form.Group>
        </Form>
    );
}

export const textInputWidget = {
    type: "text-input",
    log: renderTextInputLogView,
    history: TextInputHistory,
    gameChoice: TextInput,
} satisfies WidgetRegistry;
