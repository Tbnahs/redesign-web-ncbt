import { createFileRoute,redirect } from '@tanstack/react-router';
export const Route=createFileRoute('/tintuc/$slug')({beforeLoad:({params})=>{throw redirect({to:'/tin-tuc/$slug',params:{slug:params.slug}});}});
