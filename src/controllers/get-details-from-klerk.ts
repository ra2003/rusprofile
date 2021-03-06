import { getRequestToKlerk } from "../components/make-request-to-klerk";
import * as fs from "fs";
import { getKlerkDetailsRawPath, getSearchPageDetailsPath } from "../../config/paths";
import { Details } from "../types/details";

export async function getDetailsFromKlerkController() {
  const companiesAnnotations: Details[] = JSON.parse(
    fs.readFileSync(getSearchPageDetailsPath(), "utf8")
  );
  const INNs = companiesAnnotations.map(company => company.INN);

  const companies = [];
  for (const [index, INN] of INNs.entries()) {
    console.log(`INN: #${index} :`, INN);
    companies.push(await getRequestToKlerk(getUrl(INN)));
    if (index && index % 20 === 0) {
      fs.writeFileSync(
        getKlerkDetailsRawPath(),
        JSON.stringify(companies, undefined, 4)
      );
    }
  }
  fs.writeFileSync(
    getKlerkDetailsRawPath(),
    JSON.stringify(
      companies.filter(details => !details.error),
      undefined,
      4
    )
  );
}

function getUrl(INN: string | number): string {
  return `https://www.klerk.ru/yindex.php/v3/opendatasearch?inn=${INN}`;
}
