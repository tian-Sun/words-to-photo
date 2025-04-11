'use client';
import {createContext, useContext, useState} from "react";
import {useSession} from "next-auth/react";
import {useInterval} from "ahooks";


const CommonContext = createContext(undefined);
export const CommonProvider = ({
                                 children,
                                 commonText,
                                 authText,
                                 menuText,
                                 pricingText
                               }) => {

  const {data: session, status} = useSession();
  const [userData, setUserData] = useState({});
  const [intervalUserData, setIntervalUserData] = useState(1000);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showGeneratingModal, setShowGeneratingModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);


  useInterval(() => {
    init();
  }, intervalUserData);

  async function init() {
    if (status == 'authenticated') {
      const userData = {
        // @ts-ignore
        user_id: session?.user?.user_id,
        name: session?.user?.name,
        email: session?.user?.email,
        image: session?.user?.image,
      }
      setUserData(userData);
      setShowLoginModal(false);
      setIntervalUserData(undefined);
    }
  }

  return (
    <CommonContext.Provider
      value={{
        userData,
        setUserData,
        showLoginModal,
        setShowLoginModal,
        showLogoutModal,
        setShowLogoutModal,
        showLoadingModal,
        setShowLoadingModal,
        showGeneratingModal,
        setShowGeneratingModal,
        showPricingModal,
        setShowPricingModal,
        commonText,
        authText,
        menuText,
        pricingText,
      }}
    >
      {children}
    </CommonContext.Provider>
  );

}

export const useCommonContext = () => useContext(CommonContext)
