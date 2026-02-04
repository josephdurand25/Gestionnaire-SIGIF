import { Button } from "../../../components/Button";
import { useModal } from "../../../components/hooks/useModal";
import { Input } from "../../../components/Input";
import { Modal } from "../../../components/ui/modal";
import data from "../../../data.json";

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const handleSave = () => {
    // Handle save logic here
    console.log("Saving changes...");
    closeModal();
  };
  return (
    <div className="p-5 border border-gray-200 rounded-2xl lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800  lg:mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 ">
                First Name
              </p>
              <p className="text-sm font-medium text-gray-800 ">
                {data.user[0].first_name}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 ">
                Last Name
              </p>
              <p className="text-sm font-medium text-gray-800 ">
                {data.user[0].last_name}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 ">
                Email address
              </p>
              <p className="text-sm font-medium text-gray-800 ">
                {data.user[0].email}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 ">
                Phone
              </p>
              <p className="text-sm font-medium text-gray-800 ">
                {data.user[0].phone}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 ">
                Bio
              </p>
              <p className="text-sm font-medium text-gray-800 ">
                {data.user[0].bio}
              </p>
            </div>
          </div>
        </div>

        <Button
          action={openModal}
          variant="perso"
          supStyle="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700   dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
          
          Edit
        </Button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4  lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 ">
              Edit Personal Information
            </h4>
            <p className="mb-6 text-sm text-gray-500  lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div>
                <h5 className="mb-5 text-lg font-medium text-gray-800 lg:mb-6">
                  Social Links
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    
                    <Input
                      type="text"
                      labelText="Facebook"
                      value="https://www.facebook.com/PimjoHQ"
                    />
                  </div>

                  <div>
                    
                    <Input labelText="X.com" type="text" value="https://x.com/PimjoHQ" />
                  </div>

                  <div>
                    
                    <Input
                      type="text"
                      labelText="Linkedin"
                      value="https://www.linkedin.com/company/pimjo"
                    />
                  </div>

                  <div>
                    
                    <Input labelText="Instagram" type="text" value="https://instagram.com/PimjoHQ" />
                  </div>
                </div>
              </div>
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800  lg:mb-6">
                  Personal Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Input labelText="First Name" type="text" value={data.user[0].first_name} />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Input labelText="Last Name" type="text" value={data.user[0].last_name} />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Input labelText="Email Address" type="text" value={data.user[0].email} />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Input labelText="Phone" type="text" value={data.user[0].phone} />
                  </div>

                  <div className="col-span-2">
                    <Input labelText="Bio" type="text" value={data.user[0].bio} />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button  variant="perso" supStyle="bg-gray-200 hover:bg-gray-300 text-gray-800"  action={closeModal}>
                Close
              </Button>
              <Button  action={handleSave}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
