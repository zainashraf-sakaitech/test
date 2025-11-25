import { createRoot } from "react-dom/client";
import { useForm } from "@tanstack/react-form";
import type { AnyFieldApi } from "@tanstack/react-form";

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em>{field.state.meta.errors.join(", ")}</em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

export default function App() {
  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      age: 0,
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value);
    },
  });

  return (
    <div>
      <h1>Simple Form Example</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div>
          {/* A type-safe field component*/}
          <form.Field
            name="firstName"
            validators={{
              onChange: ({ value }) =>
                !value
                  ? "First name is required"
                  : value.length < 3
                  ? "First name must be at least 3 characters"
                  : undefined,
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: async ({ value }) => {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                return (
                  value.includes("error") && 'No "error" allowed in first name'
                );
              },
            }}
            children={(field) => {
              // Avoid hasty abstractions. Render props are great!
              return (
                <>
                  <label htmlFor={field.name}>First Name:</label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldInfo field={field} />
                </>
              );
            }}
          />
        </div>
        <div>
          <form.Field
            name="lastName"
            validators={{
              onBlur: ({ value }) =>
                !value
                  ? "Last name is required"
                  : value.length < 3
                  ? "Last name must be at least 3 characters"
                  : undefined,
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: async ({ value }) => {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                return (
                  value.includes("error") && 'No "error" allowed in last name'
                );
              },
            }}
            children={(field) => (
              <>
                <label htmlFor={field.name}>Last Name:</label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldInfo field={field} />
              </>
            )}
          />
        </div>
        <div>
          <form.Field
            name="age"
            validators={{
              onChange: ({ value }) =>
                Number(value) < 13
                  ? "You must be 13 to make an account"
                  : undefined,
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: async () => {
                await new Promise((resolve) => setTimeout(resolve, 1000));
              },
            }}
          >
            {(field) => (
              <>
                <label htmlFor={field.name}>Age:</label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  type="number"
                  // Listen to the onBlur event on the field
                  onBlur={field.handleBlur}
                  // We always need to implement onChange, so that TanStack Form receives the changes
                  onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                />
                {/* <FieldInfo field={field} /> */}
                {!field.state.meta.isValid && (
                  <em role="alert">{field.state.meta.errors.join(", ")}</em>
                )}
              </>
            )}
          </form.Field>
        </div>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button type="submit" disabled={!canSubmit}>
              {isSubmitting ? "..." : "Submit"}
            </button>
          )}
        />
      </form>
    </div>
  );
}

const rootElement = document.getElementById("root")!;

createRoot(rootElement).render(<App />);
