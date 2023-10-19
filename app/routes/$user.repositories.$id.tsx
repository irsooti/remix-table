import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { octokit } from "~/utils/oktokit.server";
import { issueLoaderSchema } from "~/utils/validation";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { idRepo, id } = issueLoaderSchema.parse({
    idRepo: params.id,
    id: params.user,
  });

  const repo = await octokit.rest.repos.get({
    owner: id,
    repo: idRepo,
  });

  return json({
    name: repo.data.name,
    description: repo.data.clone_url,
  });
};

export default function Repository() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="card bg-base-200 p-2 mb-2">
        <div className="card-body">
          <h2 className="card-title">{data.name}</h2>
          <p>{data.description}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="card bg-base-100">
          <ul className="menu bg-base-200 w-56 rounded-box gap-2">
            <li>
              <NavLink to="issues">Issues</NavLink>
            </li>
            <li>
              <NavLink to="notes">Notes</NavLink>
            </li>
          </ul>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
