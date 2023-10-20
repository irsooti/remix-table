import { Octokit } from "octokit";

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export const getUserById = async (user: string) => {
  return octokit.rest.users.getByUsername({ username: user });
};

export const getReposByUser = async (user: string) => {
  return octokit.rest.repos.listForUser({ username: user });
};

export const getIssues = ({ repo, owner }: { repo: string; owner: string }) => {
  return octokit.rest.issues.listForRepo({
    owner,
    repo,
  });
};

export const createIssue = async ({
  body,
  repo,
  title,
  owner,
}: {
  repo: string;
  owner: string;
  title: string;
  body: string;
}) => {
  const resp = await octokit.rest.issues.create({
    owner,
    repo,
    title,
    body,
  });

  if (resp.status !== 201) {
    throw new Error("Failed to create issue");
  }
};
