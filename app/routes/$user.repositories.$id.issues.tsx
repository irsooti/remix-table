import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useActionData,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { octokit } from "~/utils/oktokit.server";
import { z } from "zod";
import { issueLoaderSchema } from "~/utils/validation";

const issueActionSchema = z.object({
  title: z.string(),
  body: z.string().min(3),
});

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { idRepo, id } = issueLoaderSchema.parse({
    idRepo: params.id,
    id: params.user,
  });

  const issues = await octokit.rest.issues.listForRepo({
    owner: id,
    repo: idRepo,
  });

  return json(
    issues.data.map((issue) => ({
      title: issue.title,
      body: issue.body,
      id: issue.id,
    }))
  );
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { idRepo, id } = issueLoaderSchema.parse({
    idRepo: params.id,
    id: params.user,
  });
  const formData = await request.formData();

  const data = issueActionSchema.parse({
    title: formData.get("title"),
    body: formData.get("body"),
  });

  await octokit.rest.issues.create({
    owner: id,
    repo: idRepo,
    title: data.title,
    body: data.body,
  });

  return json(data);
};

export default function Issues() {
  const actionData = useActionData<typeof action>();
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div className="card bg-base-200 w-full">
      <div className="card-body">
        <h2 className="card-title">New Issue</h2>

        <Form method="post" className="flex w-full flex-col gap-2">
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Issue title</span>
            </label>
            <input
              defaultValue={actionData?.title}
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
              name="title"
            />
          </div>

          <textarea
            name="body"
            className="textarea textarea-bordered w-full"
            placeholder="Describe your issue"
            defaultValue={actionData?.body}
          ></textarea>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </Form>

        <div className="divider" />

        <h2 className="card-title">Issues</h2>
        {loaderData.length === 0 && <div>No issues</div>}
        {loaderData.map((issue) => (
          <div key={issue.id}>
            <h3 className="text-lg">{issue.title}</h3>
            <div
              className="text-sm"
              dangerouslySetInnerHTML={{ __html: issue?.body || "" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="card bg-error-content w-full">
        <div className="card-body">
          <h1 className="card-title">
            🏚️ {error.status} {error.statusText}
          </h1>
          <p>{error.data}</p>
        </div>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div className="card bg-error-content w-full">
        <div className="card-body">
          <h1 className="card-title">🏚️ Error</h1>
          <p>{error.message}</p>
        </div>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
