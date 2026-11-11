import media0 from "@/assets/news-media/00.asset.json";
import media1 from "@/assets/news-media/01.asset.json";
import media2 from "@/assets/news-media/02.asset.json";
import media3 from "@/assets/news-media/03.asset.json";
import media4 from "@/assets/news-media/04.asset.json";
import media5 from "@/assets/news-media/05.asset.json";
import media6 from "@/assets/news-media/06.asset.json";
import media7 from "@/assets/news-media/07.asset.json";
import media8 from "@/assets/news-media/08.asset.json";
import media9 from "@/assets/news-media/09.asset.json";
import media10 from "@/assets/news-media/10.asset.json";
import media11 from "@/assets/news-media/11.asset.json";
import media12 from "@/assets/news-media/12.asset.json";
import media13 from "@/assets/news-media/13.asset.json";
import media14 from "@/assets/news-media/14.asset.json";
import media15 from "@/assets/news-media/15.asset.json";

const imageUrls: Record<string, string> = {
  "/__l5e/assets-v1/a4136a03-8696-444a-818b-b15ac9929871/nbc-photo-00.jpg": media0.url,
  "/__l5e/assets-v1/e3220da2-fb8d-47b7-84ae-9092c1270817/nbc-photo-01.jpg": media1.url,
  "/__l5e/assets-v1/7b3c2fe1-bf20-49c1-a282-7657abd52110/nbc-photo-02.jpg": media2.url,
  "/__l5e/assets-v1/a6b31dcb-13ff-437b-a101-c11ee4350315/nbc-photo-03.jpg": media3.url,
  "/__l5e/assets-v1/18f8a92e-9f69-468e-bf9c-933ce3aafd30/nbc-photo-04.jpg": media4.url,
  "/__l5e/assets-v1/29ab5ac2-4c96-4684-90bf-6a4e1cdb9a07/nbc-photo-05.jpg": media5.url,
  "/__l5e/assets-v1/78adee42-ed7c-414d-9c0e-b3e133786fa1/nbc-photo-06.jpg": media6.url,
  "/__l5e/assets-v1/0c1d4088-6ea0-47ac-b349-502ef8b0782b/nbc-photo-07.jpg": media7.url,
  "/__l5e/assets-v1/7f6b693b-cf78-450a-96ae-d097788b2ebc/nbc-photo-08.jpg": media8.url,
  "/__l5e/assets-v1/b63c95e7-1d14-44c5-818d-18634c96a582/nbc-photo-09.jpg": media9.url,
  "/__l5e/assets-v1/ac84896c-4975-42d6-b3f2-25735181c5dc/nbc-photo-10.jpg": media10.url,
  "/__l5e/assets-v1/a5a2af4d-d226-43de-ae74-233530435fb9/nbc-photo-11.jpg": media11.url,
  "/__l5e/assets-v1/eeb0c1a1-ece1-4ff8-9b04-0aefd65de654/nbc-photo-12.jpg": media12.url,
  "/__l5e/assets-v1/f3323155-b1c9-4cd9-949a-3f11d68c96c5/nbc-photo-13.jpg": media13.url,
  "/__l5e/assets-v1/b84e2af1-9d80-4c66-917b-14ce77c890cd/nbc-photo-14.jpg": media14.url,
  "/__l5e/assets-v1/c60f4f2d-9ab7-4e03-948f-9ca7a58b544d/nbc-photo-15.jpg": media15.url,
};

export function mediaUrl(url: string): string {
  return imageUrls[url] ?? url;
}
