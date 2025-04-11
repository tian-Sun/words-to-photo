import {Fragment, useRef, useState} from 'react'
import {Dialog, Transition} from '@headlessui/react'
import Pricing from "~/components/PricingComponent";
import {useCommonContext} from "~/context/common-context";

export default function PricingModal({
                                       locale,
                                       page
                                     }) {

  const [redirectUrl] = useState(`${locale}/${page}`);

  const cancelButtonRef = useRef(null)
  const {showPricingModal, setShowPricingModal} = useCommonContext();

  return (
    <Transition.Root show={showPricingModal} as={Fragment}>
      <Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setShowPricingModal} onClick={() => setShowPricingModal(true)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
        </Transition.Child>

        <div className="fixed inset-0 z-30 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-4"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl">
                <Pricing
                  redirectUrl={redirectUrl}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
