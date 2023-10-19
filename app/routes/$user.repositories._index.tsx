import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getReposByUser } from "~/utils/oktokit.server";
import { userSchema } from "~/utils/validation";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = userSchema.parse({ id: params.user });
  const repositories = await getReposByUser(id);

  return json(repositories.data?.map((repo) => repo.name));
};

export default function Repositories() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="card bg-base-200 p-2 mt-2">
      <div className="card-body">
        <h1 className="card-title">Repositories</h1>
        <div>
          <ul>
            {data.map((repo) => (
              <li key={repo}>
                <Link className="link" to={`${repo}`}>
                  {repo}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
