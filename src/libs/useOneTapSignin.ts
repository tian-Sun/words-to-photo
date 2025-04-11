'use client';
import { useSession, signIn, SignInOptions } from "next-auth/react";
import {useCommonContext} from "~/context/common-context";

interface OneTapSigninOptions {
  parentContainerId?: string;
}

const useOneTapSignin = (options?: OneTapSigninOptions & Pick<SignInOptions, "redirect" | "callbackUrl">) => {
  const { parentContainerId } = options || {};
  const { showLoadingModal, setShowLoadingModal } = useCommonContext();

  // Taking advantage in recent development of useSession hook.
  // If user is unauthenticated, google one tap ui is initialized and rendered
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      if (!showLoadingModal) {
        const { google } = window;
        if (google) {
          google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            callback: async (response: any) => {
              setShowLoadingModal(true);
              // Here we call our Provider with the token provided by google
              await signIn("googleonetap", {
                credential: response.credential,
                redirect: true,
                ...options,
              });
              setShowLoadingModal(false);
            },
            prompt_parent_id: parentContainerId,
          });
          // Here we just console.log some error situations and reason why the Google one tap
          // is not displayed. You may want to handle it depending on your application
          google.accounts.id.prompt((notification: any) => {
            if (notification.isNotDisplayed()) {
              console.log("getNotDisplayedReason ::", notification.getNotDisplayedReason());
            } else if (notification.isSkippedMoment()) {
              console.log("getSkippedReason  ::", notification.getSkippedReason());
            } else if (notification.isDismissedMoment()) {
              console.log("getDismissedReason ::", notification.getDismissedReason());
            }
          });
        }
      }
    },
  });

  return { showLoadingModal };
};

export default useOneTapSignin;
