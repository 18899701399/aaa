import {debounce} from "@/common/utils";

export const itemListenerMixin = {
  date() {
    return {
      itemImgListener: null
    }
  },
  mounte() {
    let refresh = debounce(this.$refs.scroll.refresh, 500)

    // 对监听的事件进行保存
    this.itemImgListener = () => {
      refresh()
    }
    this.$bus.$on('itemImageLoad', this.itemImgListener)
  }
}
