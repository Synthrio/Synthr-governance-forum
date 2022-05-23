import UserMenuItemsList from "discourse/components/user-menu/items-list";
import I18n from "I18n";

export default class UserMenuNotificationsList extends UserMenuItemsList {
  get filterByType() {
    return null;
  }

  get showAll() {
    return true;
  }

  get showAllHref() {
    return `${this.currentUser.path}/notifications`;
  }

  get showAllTitle() {
    return I18n.t("user_menu.view_all_notifications");
  }

  get showDismiss() {
    return this.items.some((item) => !item.read);
  }

  get dismissTitle() {
    return I18n.t("user.dismiss_notifications_tooltip");
  }

  get itemsCacheKey() {
    let key = "recent-notifications";
    if (this.filterByType) {
      key += `-type-${this.filterByType}`;
    }
    return key;
  }

  fetchItems() {
    const params = {
      limit: 30,
      recent: true,
      bump_last_seen_reviewable: true,
      silent: this.currentUser.enforcedSecondFactor,
    };

    if (this.filterByType) {
      params.filter_by_type = this.filterByType;
    }
    return this.store
      .findStale("notification", params)
      .refresh()
      .then((c) => {
        return c.content;
      });
  }
}
