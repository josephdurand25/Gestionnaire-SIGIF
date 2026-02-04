import { Button } from "../../../components/Button";
import { useModal } from "../../../components/hooks/useModal";
import { Input } from "../../../components/Input";
import { Modal } from "../../../components/ui/modal";
import data from "../../../data.json";


export default function UserAddressCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const handleSave = () => {
    // Handle save logic here
    console.log("Saving changes...");
    closeModal();
  };
  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
             <ul className="mb-3">
            <h4 className="text-lg font-semibold text-gray-800  lg:mb-6">
              Contact Addres
            </h4>
              <li>
                <p className="mb-2 text-xs leading-normal text-gray-500 ">
                  Phone
                </p>
                <p className="text-sm font-medium text-gray-800 ">
                  {data.user[0].phone}
                </p>
              </li>
             </ul>
         
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
           <ul >
            
            <li>
                <p className="mb-2 text-xs leading-normal text-gray-500 ">
                  Country
                </p>
                <p className="text-sm font-medium text-gray-800 ">
                  {data.user[0].pays}
                </p>
              </li>
           </ul>

              

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 ">
                  City/State
                </p>
                <p className="text-sm font-medium text-gray-800 ">
                 {data.user[0].ville}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 ">
                  Postal Code
                </p>
                <p className="text-sm font-medium text-gray-800 ">
                  {data.user[0].code_postal}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 ">
                  TAX ID
                </p>
                <p className="text-sm font-medium text-gray-800 ">
                  {data.user[0].tax_id}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800  lg:inline-flex lg:w-auto"
          >
          
            Edit
          </button>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 ">
              Edit Address
            </h4>
            <p className="mb-6 text-sm text-gray-500  lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  
                  <Input labelText="Country" type="text" value={data.user[0].pays} />
                </div>

                <div>
                  <Input labelText="City/State" type="text" value={data.user[0].ville} />
                </div>

                <div>
                  <Input labelText="Postal Cod" type="text" value={data.user[0].code_postal} />
                </div>

                <div>
                  <Input labelText="TAX ID" type="text" value={data.user[0].tax_id} />
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
    </>
  );
}
