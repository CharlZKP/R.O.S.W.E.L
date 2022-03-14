import Api from './Api'
import { toast } from '@zerodevx/svelte-toast'
import { theme } from '../constants/toastTheme'

export async function getAllKYCPending() {
    try {
        const res = await Api.post('/kyc-admin/info/get/unverified')
        return res
    } catch (err) {
        console.log(err)
    }
}

export async function getUserKYC(user_id)
{
    try
    {
        const res = await Api.post('/kyc-admin/info/get', {
            user_id
        })
        return res
    } 
    catch (err)
    {
        console.log(err)
        return false;
    }
}

export async function changeKycStatus(user_id, status) {
    try {
        const res = await Api.post('/kyc-admin/info/status/change', {
            user_id,
            status,
        })
        if (res.success)
            toast.push(
                'Successfully changed status to ' + status,
                theme.success
            )
        else toast.push('Failed to change status to ' + status, theme.error)
        return res
    } catch (err) {
        console.log(err)
    }
}
