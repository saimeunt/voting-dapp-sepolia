'use client';
import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import { useWaitForTransaction } from 'wagmi';
import clsx from 'clsx';

import useContext from './context/hook';
import { useAddVoter } from '../../lib/contract';
import { ZeroAddress } from '../../lib/utils';

const AddVoterModal = () => {
  const {
    state: { addVoterModalOpen },
    closeAddVoterModal,
    openNotification,
  } = useContext();
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const [voterAddress, setVoterAddress] = useState('');
  const { data, addVoter } = useAddVoter(voterAddress as `0x${string}`, () => {
    closeAddVoterModal();
    setVoterAddress('');
    openNotification(false);
  });
  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => {
      closeAddVoterModal();
      setVoterAddress('');
      openNotification(true);
      router.refresh();
    },
  });
  return (
    <Transition.Root show={addVoterModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={closeAddVoterModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-900 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="my-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-white">
                      Add a voter
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-400">This will add a new registered voter.</p>
                    </div>
                  </div>
                </div>
                <form
                  id="add-voter-form"
                  className="space-y-6"
                  onSubmit={(event) => {
                    event.preventDefault();
                    addVoter?.();
                  }}
                >
                  <div>
                    <label
                      htmlFor="arbiter"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Voter address
                    </label>
                    <div className="mt-2">
                      <input
                        className="block w-full rounded-md border-0 bg-white/5 px-3 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                        required
                        pattern="^0x[a-fA-F0-9]{40}$"
                        maxLength={42}
                        placeholder={ZeroAddress}
                        value={voterAddress}
                        onChange={(event) => setVoterAddress(event.target.value)}
                      />
                    </div>
                  </div>
                </form>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="submit"
                    form="add-voter-form"
                    disabled={isLoading}
                    className={clsx(
                      {
                        'bg-indigo-300': isLoading,
                        'bg-indigo-500': !isLoading,
                      },
                      'inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2',
                    )}
                  >
                    Add{isLoading && 'ing…'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={closeAddVoterModal}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default AddVoterModal;
