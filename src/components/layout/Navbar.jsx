import {IconUser} from '@tabler/icons-react'

export default function Navbar() {
    return (
        <div className="bg-stone-100 rounded-xl py-3 px-3 flex justify-end ">
            <div className="flex items-center justify-center gap-2">
                <p className='text-sm text-stone-900'>Hi, Manik</p>
                <div className="bg-blue-100 w-8 h-8 rounded-full flex justify-center items-center">
                    <IconUser className='text-blue-500'></IconUser>
                </div>
            </div>
        </div>
    )
}