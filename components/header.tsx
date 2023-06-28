'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import { useIsClient } from 'usehooks-ts';
import clsx from 'clsx';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Header = () => {
  const pathname = usePathname();
  const isClient = useIsClient();
  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Image
                    className="block h-8 w-auto lg:hidden"
                    src="/icon.svg"
                    alt="Escrow dApp logo"
                    width={128}
                    height={128}
                  />
                  <Image
                    className="hidden h-8 w-auto lg:block"
                    src="/icon.svg"
                    alt="Escrow dApp logo"
                    width={128}
                    height={128}
                  />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    <Link
                      href="/"
                      className={clsx(
                        {
                          'bg-gray-900 text-white': pathname === '/',
                          'text-gray-300 hover:bg-gray-700 hover:text-white': pathname !== '/',
                        },
                        'rounded-md px-3 py-2 text-sm font-medium',
                      )}
                      aria-current={pathname === '/' ? 'page' : undefined}
                    >
                      Home
                    </Link>
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {isClient && <ConnectButton />}
              </div>
            </div>
          </div>
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              <Disclosure.Button
                as={Link}
                href="/"
                className={clsx(
                  {
                    'bg-gray-900 text-white': pathname === '/',
                    'text-gray-300 hover:bg-gray-700 hover:text-white': pathname !== '/',
                  },
                  'block rounded-md px-3 py-2 text-base font-medium',
                )}
                aria-current={pathname === '/' ? 'page' : undefined}
              >
                Home
              </Disclosure.Button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Header;
