import { ContactListProps } from 'components/99_mocks/Home/ContactList'

export const contactList = (
  descGen: (i: number) => string | undefined
): ContactListProps['contacts'] => {
  const result: ContactListProps['contacts'] = []
  for (let i = 1; i <= 100; i++) {
    const r = Math.floor(Math.random() * Math.floor(2)) % 2
    result.push({
      name: `鈴木${i + (r ? '子' : '郎')}`,
      image: illustya[r],
      desc: descGen(i)
    })
  }
  return result
}

/** イラスト屋 イラスト */
const illustya = [
  // 男
  'https://1.bp.blogspot.com/-Na00Q49BuPg/XJB5IFwcscI/AAAAAAABR8g/aWBDjkVwnHU2CVeLX2dgklqWQdz03DU4wCLcBGAs/s800/pistol_pose_man.png',
  // 女
  'https://1.bp.blogspot.com/-gTf4sWnRdDw/X0B4RSQQLrI/AAAAAAABarI/MJ9DW90dSVwtMjuUoErxemnN4nPXBnXUwCNcBGAsYHQ/s1600/otaku_girl_fashion.png'
]
