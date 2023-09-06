import React from 'react';
import { useState } from 'react';
import { SlTrash, SlMagnifier } from "react-icons/sl";
import { VscEdit } from "react-icons/vsc";
import { IoMapSharp, IoAddCircleOutline, IoArrowForwardCircleOutline, IoArrowBackCircleOutline } from "react-icons/io5";
import DataBase from "../../dataBase"
const Peta = React.lazy(() => import("OpenLayers/Openlayers"))

function Home() {
    const [listData, setData] = useState(DataBase)
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    // const currentItems = listData.slice(startIndex, endIndex);

    const [openPeta, setOpenPeta] = useState(false)
    const ShowPeta = () => {
        if (openPeta) {
            setOpenPeta(false);
        } else {
            setOpenPeta(true);
        }
    }

    const onDelete = (userid) => {
        const updatedUsers = listData.filter(user => user.id !== userid);
        setData(updatedUsers);
    };

    const [searchKeyword, setSearchKeyword] = useState("");

    const filteredData = listData.filter((item) =>
        item.nama.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    const currentItems = filteredData.slice(startIndex, endIndex);

    return (
        <div className='h-screen'>
            {!openPeta ? (
                <div className='h-screen  bg-bgHome'>
                    <div className='h-1/6 flex'>
                        <div className='text-bgCerah m-auto '>
                            <h1 className='text-2xl font-bold'>Data Mahasiswa Gunners University</h1>
                            <div className='w-full'>
                                <button className='flex m-auto text-sm' onClick={ShowPeta}>
                                    <IoMapSharp className=' m-1' />
                                    <p className='text-center '>Lokasi Kampus</p>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='h-4/6'>
                        <div className='h-1/6'>
                            <div className='m-auto w-1/2 bg-bgCerah rounded-lg'>
                                <div className='flex'>
                                    <SlMagnifier className='m-2 text-bgHome' />
                                    <input
                                        type="text"
                                        className="w-full grow text-bgHome px-auto py-1 text-center font-medium text-sm bg-transparent"
                                        placeholder="Search Student"
                                        value={searchKeyword}
                                        onChange={(e) => setSearchKeyword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='m-auto h-5/6 w-2/3 bg-bgTabel rounded-xl'>
                            <div className="h-full w-full bg-[#F2ECBE] w-5/6 rounded-lg">
                                <div className='grid grid-cols-8 gap-2 text-center bg-bgCerah rounded-t-lg text-bgTabel font-inter font-bold text-sm'>
                                    <div className=''>No</div>
                                    <div className=''>Nama</div>
                                    <div className=''>Email</div>
                                    <div className='col-span-3 '>Alamat</div>
                                </div>
                                <div className='h-5/6 w-full text-bgCerah overflow-auto'>
                                    <div className=''>
                                        {currentItems.map((i, no) => (
                                            <div key={i.id} className="grid grid-cols-8 gap-2 text-center text-[#BB2525]">
                                                <div className="font-bold text-sm text-center m-2">{no + 1}</div>
                                                <div className="font-bold text-sm text-center m-2">{i.nama}</div>
                                                <div className="col-span-2 font-bold text-sm text-center m-2">{i.email}</div>
                                                <div className="col-span-2 font-bold text-sm text-center m-2">{i.alamat}</div>
                                                <button onClick={() => onDelete(i.id)}>
                                                    <SlTrash className='m-auto hover:bg-[#9A3B3B]/80 rounded-lg h-2/3 hover:text-white' />
                                                </button>
                                                <button >
                                                    <VscEdit className='m-auto hover:bg-[#C08261] rounded-lg h-2/3 hover:text-white' />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="py-4 flex justify-center mx-auto">
                                    <button
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="mr-2 w-4 h-4 text-bgCerah hover:bg-[#9A3B3B] rounded-full hover:text-white"
                                    >
                                        <IoArrowBackCircleOutline />
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        disabled={endIndex >= listData.length}
                                        className="ml-2 w-4 h-4 text-bgCerah hover:bg-[#9A3B3B] rounded-full hover:text-white"
                                    >
                                        <IoArrowForwardCircleOutline />
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className='h-1/6'></div>
                </div>
            ) : (
                < React.Suspense fallback={"Loading"} >
                    <Peta />
                </React.Suspense >
            )}
        </div>
    )
}

export default Home;