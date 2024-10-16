export default function Modal({result=(e:any)=>{},body=<>test</>,title='Modal title', className='max-w-2xl', footer=''}){

    const close=()=>{
        result({event:'close'})
    }

    return <>
    <div className="modal overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-[999] justify-center items-center w-full md:inset-0  max-h-full">
    <div className={`relative p-4 w-full ${className}  max-h-full mx-auto`}>

        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                   {title}
                </h3>
                <button type="button" onClick={close} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span className="sr-only">Close modal</span>
                </button>
            </div>
            <div className="p-4 md:p-5 space-y-4 ">
                {body}
            </div>
            {footer}
        </div>
    </div>
</div>
    </>
}