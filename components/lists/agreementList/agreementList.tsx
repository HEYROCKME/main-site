import { AvtaleGiroAgreement, Donation, VippsAgreement } from "../../../models";
import { shortDate, thousandize } from "../../../util/formatting";
import { GenericList, ListRow } from "../genericList";

export const AgreementList: React.FC<{ agreements: (AvtaleGiroAgreement | VippsAgreement)[], title: string, supplemental: string}> = ({ agreements, title, supplemental }) => {
  const headers = ["Type", "Dato", "Sum", "KID"];

  const rows: ListRow[] = agreements.map(agreement => ({
    id: agreement.ID.toString(),
    cells: ["TYPE", 
      "Den " + ((agreement as AvtaleGiroAgreement).payment_date || (agreement as VippsAgreement).monthly_charge_day).toString() + ". hver måned",
      thousandize(agreement.amount) + " kr",
      agreement.KID],
    details: <></>
  }))

  return (
    <GenericList title={title}
      supplementalInformation={supplemental}
      headers={headers}
      rows={rows} />
  );
}