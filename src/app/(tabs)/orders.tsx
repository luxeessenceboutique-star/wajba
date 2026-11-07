/** Commandes (cart, payment, tracking, history) — placeholder until phase 4. */
import { TabPlaceholder } from "@/components";
import { t } from "@/i18n";

export default function OrdersScreen() {
  return <TabPlaceholder title={t("placeholder.ordersTitle")} text={t("placeholder.ordersText")} icon="receipt" />;
}
