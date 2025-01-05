import axios from "axios";

export async function postBoard(url: string) {
  const res = await axios.post("/api/board/post", {
    url: url,
  });
  console.log('이미지 스캔', res.data)
  // return res
}
