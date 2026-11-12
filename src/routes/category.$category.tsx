import { createFileRoute,redirect } from '@tanstack/react-router';
const pages:Record<string,string>={'gioi-thieu-chung':'/gioi-thieu/lich-su-hinh-thanh','so-do-to-chuc':'/gioi-thieu/co-cau-to-chuc','cau-hoi-thuong-gap':'/hoi-dap/cau-hoi-thuong-gap','danh-sach-cau-hoi':'/hoi-dap/danh-sach-cau-hoi','tao-cau-hoi':'/hoi-dap/tao-cau-hoi','lien-he':'/lien-he'};
export const Route=createFileRoute('/category/$category')({beforeLoad:({params})=>{const path=pages[params.category];if(path)throw redirect({to:path as '/'});throw redirect({to:'/tin-tuc/$slug',params:{slug:params.category}});}});
