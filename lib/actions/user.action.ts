"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { Query, ID } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
import { cookies } from "next/headers";
import { avatarPlaceholderUrl } from "@/constants";
import { redirect } from "next/navigation";

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("email", [email])],
  );

  return result.total > 0 ? result.documents[0] : null;
};

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createEmailToken(
      ID.unique(),
      email
    );

    return session.userId;
  } catch (error) {
    handleError(error, "Failed to send OTP");
  }
};

export const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {
  try {
    // Mock implementation - replace with your actual logic
    console.log("Creating account for:", { fullName, email });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Return mock user data
    return {
      accountId: `account_${Date.now()}`,
      email,
      fullName,
    };
  } catch (error) {
    console.error("Error creating account:", error);
    throw new Error("Failed to create account");
  }
};

export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    // Mock implementation - replace with your actual logic
    console.log("Verifying OTP:", { accountId, password });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Return mock session ID
    return `session_${Date.now()}`;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw new Error("Failed to verify OTP");
  }
};

export const getCurrentUser = async () => {
  try {
    const { databases, account } = await createSessionClient();

    const result = await account.get();

    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", result.$id)],
    );

    if (user.total <= 0) return null;

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

export const signOutUser = async () => {
  const { account } = await createSessionClient();

  try {
    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
  } catch (error) {
    handleError(error, "Failed to sign out user");
  } finally {
    redirect("/sign-in");
  }
};

export const signInUser = async ({ email }: { email: string }) => {
  try {
    // Mock implementation - replace with your actual logic
    console.log("Signing in user:", email);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Return mock user data
    return {
      accountId: `account_${Date.now()}`,
      email,
    };
  } catch (error) {
    console.error("Error signing in:", error);
    throw new Error("Failed to sign in");
  }
};