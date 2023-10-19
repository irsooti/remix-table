import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { getUserById } from "~/utils/oktokit.server";
import { userSchema } from "~/utils/validation";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const user = userSchema.parse({ id: params.user });
  const { data } = await getUserById(user.id);

  return json({
    avatar: data.avatar_url,
    name: data.name,
    followers: data.followers,
    following: data.following,
    bio: data.bio,
  });
};

export default function Repositories() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-center">
        <div className="m-auto pt-16 pb-8">
          <div className="stats">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <div className="avatar">
                  <div className="w-16 rounded-full">
                    <img alt="" src={data.avatar} />
                  </div>
                </div>
              </div>
              <div className="stat-value">{data.name}</div>
              <div className="stat-title">{data.bio}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Total followers</div>
              <div className="stat-value text-primary">{data.followers}</div>
            </div>

            <div className="stat">
              <div className="stat-title">Total following</div>
              <div className="stat-value text-secondary">{data.following}</div>
            </div>
          </div>
        </div>
        <div className="px-2 w-full">
          <div className="pb-16">
            <Outlet />
          </div>
        </div>
        <label
          htmlFor="my-drawer-2"
          className="btn btn-primary drawer-button lg:hidden"
        >
          Open drawer
        </label>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content gap-2">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="repositories">Repositories</NavLink>
          </li>
          <li>
            <NavLink to="detail">Detail</NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}
