import { SideMenu } from "../components/SideMenu"
import StickyFooter from "../components/StickyFooter"

// @ts-ignore
export function Layout({ page }) {
  return (
    <>
      <SideMenu />
        {page}
      <StickyFooter />  
    </>
  );
}
