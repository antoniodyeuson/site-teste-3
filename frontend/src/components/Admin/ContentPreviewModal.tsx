import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { FiX } from 'react-icons/fi';

interface ContentPreviewModalProps {
  content: {
    id: string;
    title: string;
    type: string;
    url: string;
    creator: {
      name: string;
    };
    createdAt: string;
  };
  onClose: () => void;
}

export default function ContentPreviewModal({ content, onClose }: ContentPreviewModalProps) {
  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Dialog.Title className="text-lg font-medium">
                      {content.title}
                    </Dialog.Title>
                    <p className="text-sm text-gray-500">
                      By {content.creator.name} • {new Date(content.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>

                <div className="mt-4">
                  {content.type === 'image' ? (
                    <img
                      src={content.url}
                      alt={content.title}
                      className="w-full rounded-lg"
                    />
                  ) : content.type === 'video' ? (
                    <video
                      src={content.url}
                      controls
                      className="w-full rounded-lg"
                    />
                  ) : content.type === 'audio' ? (
                    <audio
                      src={content.url}
                      controls
                      className="w-full"
                    />
                  ) : null}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 