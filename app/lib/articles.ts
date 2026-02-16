export type Article = {
  id: string
  title: string
  description: string
  image: string      // 👉 link ảnh món ăn
  externalUrl: string // 👉 link bài báo bên ngoài
}

export function generateArticles(): Article[] {
  return [
    {
      id: "pho-bo",
      title: "Phở bò Hà Nội – Tinh hoa ẩm thực Việt",
      description:
        "Phở bò là món ăn nổi tiếng với nước dùng thanh ngọt, thịt bò mềm và bánh phở dai.",
      image: "/images/pho-bo.jpg", 
      externalUrl: "https://dulichquanhhanoi.com/pho-bo-ha-noi-tinh-hoa-am-thuc-viet-nam/",
    },
    {
      id: "goi-cuon",
      title: "Gỏi cuốn – Món ăn thanh mát mùa hè",
      description:
        "Gỏi cuốn kết hợp tôm, thịt, rau sống và bánh tráng chấm nước mắm đặc biệt.",
      image: "/images/goi-cuon.jpg",
      externalUrl: "https://amthucmuonnoi.net/goi-cuon/",
    },
    {
      id: "com-tam",
      title: "Cơm tấm Sài Gòn – Hương vị đường phố",
      description:
        "Cơm tấm với sườn nướng thơm lừng là đặc sản nổi tiếng của Sài Gòn.",
      image: "/images/com-tam.jpg",
      externalUrl: "https://comtamghien.com/gioi-thieu-ve-com-tam/",
    },
  ]
}
