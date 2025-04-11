import useOneTapSignin from "~/libs/useOneTapSignin";

const OneTapComponent = () => {
  const { showLoadingModal: oneTapIsLoading } = useOneTapSignin({
    redirect: false,
    parentContainerId: "oneTap",
  });

  return <div id="oneTap" className="fixed top-0 right-0 " />;  // This is done with tailwind. Update with system of choice
};

export default OneTapComponent;
