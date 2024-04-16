import React, { useEffect, useState } from 'react';
import ApiClient from '../../methods/api/apiClient';
import './style.scss';
import loader from '../../methods/loader';
import Html from './html';
import { useNavigate } from 'react-router-dom';
import environment from '../../environment';
import axios from 'axios';
import shared from './shared';
import { useSelector } from 'react-redux';

const AssignMembers = () => {
    const user = useSelector((state) => state.user);
    const searchState = {data:''}
    const [filters, setFilter] = useState({ page: 1, count: 50, search: '', catType: '' })
    const [data, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [loaging, setLoader] = useState(true)
    const history = useNavigate()

    useEffect(() => {
        if (user && user.loggedIn) {
            setFilter({ ...filters, search: searchState.data })
            getData({ search: searchState.data, page: 1 })
        }
    }, [])


    const sortClass = (key) => {
        let cls = 'fa-sort'
        if (filters.key == key && filters.sorder == 'asc') cls = 'fa-sort-up'
        else if (filters.key == key && filters.sorder == 'desc') cls = 'fa-sort-down'
        return 'fa ' + cls
    }


    const sorting = (key) => {
        let sorder = 'asc'
        if (filters.key == key) {
            if (filters.sorder == 'asc') {
                sorder = 'desc'
            } else {
                sorder = 'asc'
            }
        }

        let sortBy = `${key} ${sorder}`;
        setFilter({ ...filters, sortBy, key, sorder })
        getData({ sortBy, key, sorder })
    }

    const getData = (p = {}) => {
        setLoader(true)
        let filter = { ...filters, ...p ,
            // addedBy:user._id,
            groupId:user.groupId._id}
        ApiClient.get(shared.listApi, filter).then(res => {
            if (res.success) {
                setData(res.data.map(itm => {
                    itm.id = itm._id
                    return itm
                }))
                setTotal(res.total)
            }
            setLoader(false)
        })
    }


    const clear = () => {
        setFilter({ ...filters, search: '',status:'', page: 1 })
        getData({ search: '', status:'',page: 1 })
    }

    const deleteItem = (id) => {
        if (window.confirm("Do you want to delete this")) {
            loader(true)
            ApiClient.delete(shared.deleteApi, { id: id }).then(res => {
                if (res.success) {
                    // ToastsStore.success(res.message)
                    clear()
                }
                loader(false)
            })
        }
    }

    const pageChange = (e) => {
        setFilter({ ...filters, page: e })
        getData({ page: e })
    }

    const changestatus = (e) => {
        setFilter({ ...filters, status: e, page: 1 })
        getData({ status: e, page: 1 })
    }


    const statusChange = (itm) => {
        let status = 'active'
        if (itm.status == 'active') status = 'deactive'

        if (window.confirm(`Do you want to ${status == 'active' ? 'Activate' : 'Deactivate'} this`)) {
            loader(true)
            ApiClient.put(shared.statusApi, { id: itm.id, status }).then(res => {
                if (res.success) {
                    getData()
                }
                loader(false)
            })
        }
    }

    const edit = (id) => {
        history(`/${shared.url}/edit/${id}`)
    }

    const view = (id) => {
        let url=`/${shared.url}/detail/${id}`
        history(url)
    }

    

    const exportfun = async () => {
        const token = await localStorage.getItem("token");
        const req = await axios({
            method: "get",
            url: `${environment.api}api/export/excel`,
            responseType: "blob",
            body: { token: token }
        });
        var blob = new Blob([req.data], {
            type: req.headers["content-type"],
        });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `${shared.title}.xlsx`;
        link.click();
    }

    const isAllow = (key = '') => {
        let permissions = user.customerRole?.permissions
        let value = permissions?.[key]
        return value
    }

    const roleUpdate=(row,role)=>{
        let payload={
            id:row.id,
            role:role
        }
        if(!role) return
        loader(true)
        ApiClient.put('api/members/update',payload).then(res=>{
            loader(false)
            if(res.success){
                clear()
            }
        })
    }

    return <><Html
        edit={edit}
        view={view}
        clear={clear}
        sortClass={sortClass}
        roleUpdate={roleUpdate}
        sorting={sorting}
        isAllow={isAllow}
        pageChange={pageChange}
        deleteItem={deleteItem}
        filters={filters}
        loaging={loaging}
        data={data}
        total={total}
        statusChange={statusChange}
        changestatus={changestatus}
        exportfun={exportfun}
    />
    </>;
};

export default AssignMembers;
