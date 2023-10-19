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
