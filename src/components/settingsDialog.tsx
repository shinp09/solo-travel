import * as React from "react";
import ReactModal from "react-modal";

interface Props {
  /** このダイアログを表示するなら true */
  isOpen: boolean;
  /** このダイアログを閉じるときのコールバック */
  onClose?: () => void;
}

interface State {
  username: string;
}

export class SettingsDialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      username: "",
    };

    // 具体的に #root 要素などを指定した方がよい？
    ReactModal.setAppElement("body");
  }

  public render(): React.ReactNode {
    return (
      <div>
        <ReactModal
          isOpen={this.props.isOpen}
          onAfterOpen={this.handleOpen}
          onRequestClose={this.handleClose}
          style={this.customStyles}
          contentLabel="Settings"
        >
          <form onSubmit={this.handleSubmit}>
            <label>
              ユーザー名
              <input
                type="text"
                autoFocus
                value={this.state.username}
                onChange={this.handleChangeUsername}
              ></input>
            </label>
          </form>
        </ReactModal>
      </div>
    );
  }

  // フォームのサブミット時にダイアログを閉じる
  private handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.handleClose();
  };

  private handleChangeUsername = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({ username: event.target.value });
  };

  // ダイアログが開いたときに呼び出される
  private handleOpen = () => {
    // ここで設定情報などを読み込む
  };

  // ダイアログ領域外のクリックや、ESCキーを押したときに呼び出される
  private handleClose = () => {
    // 親コンポーネントにダイアログを閉じてもらうためのコールバック通知
    this.props.onClose?.();
  };

  // スタイルのカスタマイズ
  private customStyles: ReactModal.Styles = {
    // ダイアログ内のスタイル（中央に表示）
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
    // 親ウィンドウのスタイル（ちょっと暗くする）
    overlay: {
      background: "rgba(0, 0, 0, 0.2)",
    },
  };
}
