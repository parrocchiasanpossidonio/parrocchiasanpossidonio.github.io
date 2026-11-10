import { Intestazione } from "../components/ui"; import { OrariCompatti } from "../components/Messe";
export default function Orari(){return <><Intestazione numero="I" sezione="Celebrazioni" titolo="Orari delle Messe"/><section className="contenitore"><div className="border-t-2 border-ink pt-6"><OrariCompatti/></div></section></>}
