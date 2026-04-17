
import { showToast } from "../redux/slices/toast.slice";
import { AppDispatch } from "../redux/store";


class Alert {
  static dispatch: AppDispatch | null = null;

  static setDispatch(dispatch: AppDispatch) {
    Alert.dispatch = dispatch;
  }

  static success(message: string) {
    Alert.dispatch?.(showToast({ type: 1, message }));
  }

  static info(message: string) {
    Alert.dispatch?.(showToast({ type: 2, message }));
  }

  static warning(message: string) {
    Alert.dispatch?.(showToast({ type: 3, message }));
  }
}

export default Alert;
