import {
  json,
  redirect,
  type ActionFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { getUserById } from "~/utils/oktokit.server";
import { userSchema } from "~/utils/validation";

export const meta: MetaFunction = () => {
  return [
    { title: "Remixtable" },
    { name: "description", content: "A simple application to show how to use Remix" },
  ];
};

const texts = {
  title: "Remixtable",
  description: "Search a github username to see his repositories",
  button: "Get Started",
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const validation = userSchema.safeParse({ id: formData.get("id") });

  if (!validation.success) {
    return json(validation.error);
  }

  const { id } = validation.data;

  try {
    await getUserById(id);

    return redirect(`/${id}`);
  } catch (error) {
    return json({ error: "User not found" }, { status: 404 });
  }
};

export default function Index() {
  const data = useActionData<typeof action>();

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">{texts.title}</h1>
          <p className="py-6">{texts.description}</p>
          <Form method="post">
            {data && "error" in data ? (
              <div className="alert alert-error mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{data.error}</span>
              </div>
            ) : null}
            <div className="flex gap-2">
              <input
                name="id"
                type="text"
                placeholder="Github username"
                className="input input-bordered w-full max-w-xs"
              />
              <button type="submit" className="btn btn-primary">
                {texts.button}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
