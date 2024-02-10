import React, {useState, useLayoutEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {NumberInput, CustomButton} from '../components/SmallComponents';

const PublishScreen = ({navigation}: {navigation: any}) => {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [caution, setCaution] = useState('');
  const [maxLoanDays, setMaxLoanDays] = useState('');
  const [loanAmount, setLoanAmount] = useState('');

  const [imageUris, setImageUris] = useState<string[] | null>(null);

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
      selectionLimit: 3,
    });

    if (result.assets) {
      const newUris = result.assets.map(asset => asset.uri);
      setImageUris(newUris as string[]);
    }
  };

  const saveItem = () => {
	// 画像
	// アイテム名
	// 説明文
	// 注意事項
	// 貸出日数上限
	// 貸出金額
	console.log('登録ボタンが押されました');
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}>
          <Text>X</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <ScrollView>
      {/* テキスト "アイテムの編集" */}
      <Text style={styles.headerText}>アイテムの編集</Text>

      {/* 画像登録エリア */}
      <Button title="画像をアップロード" onPress={pickImage} />
      {imageUris && (
        <View style={styles.imagesContainer}>
          {imageUris.map((uri, index) => (
            <Image
              key={index}
              source={{uri}}
              style={styles.image}
              onError={error => console.log(error)}
            />
          ))}
        </View>
      )}

      {/* アイテム名入力 */}

      <Text style={styles.textLabel}>アイテム名</Text>
      <TextInput
        style={styles.input}
        value={itemName}
        onChangeText={setItemName}
        placeholder="アイテム名を入力"
      />

      {/* 説明文入力 */}
      <Text style={styles.textLabel}>説明文</Text>
      <TextInput
        style={[styles.input, {height: 100}]}
        value={description}
        onChangeText={setDescription}
        placeholder="車種: トヨタ シエンタ
				年式: 2020年
				色: ネイビーブルー
				走行距離: 30,000km
				定員: 7名
				
				このトヨタ シエンタは、ファミリーに最適なコンパクトながらも広々とした室内空間を提供するミニバンです。
				ネイビーブルーのボディがエレガントな印象を与え、どんなシチュエーションでも活躍します。"
        multiline
      />

      {/* 注意事項入力 */}
      <Text style={styles.textLabel}>注意事項</Text>
      <TextInput
        style={[styles.input, {height: 100}]}
        value={caution}
        onChangeText={setCaution}
        placeholder="禁煙: 車内での喫煙は固く禁じられています。喫煙による損害が発生した場合は、修理費用を請求させていただきます。
				ペットの同乗: ペットを同乗させる場合は、事前に申し出てください。また、車内が汚れた場合は清掃費用を請求することがあります。
				返却時: 使用後は車を清潔に保ち、元の状態で返却してください。ガソリンはフルタンクで返却することを推奨します。
				事故や故障: 事故や故障が発生した場合は、直ちに連絡してください。保険適用の手続きや修理の手配など、迅速に対応いたします。"
        multiline
      />

      {/* 貸出日数上限入力 */}
      <View style={styles.row}>
        <Text style={styles.textLabelRow}>貸出日数上限</Text>
        <NumberInput
          value={maxLoanDays}
          onChangeText={setMaxLoanDays}
          placeholder="30日"
          style={styles.input}
        />
      </View>

      <View style={styles.border} />

      {/* 貸出金額入力 */}
      <View style={styles.row}>
        <Text style={styles.textLabelRow}>貸出金額</Text>
        <NumberInput
          value={loanAmount}
          onChangeText={setLoanAmount}
          placeholder="¥300"
          //   style
          style={styles.input}
        />
      </View>

      <CustomButton
        style={{
          backgroundColor: 'lightblue',
          padding: 10,
          borderRadius: 5,
          marginTop: 20,
          width: 100,
          alignSelf: 'center',
        }}
        title="登録"
        onPress={saveItem}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  border: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  textLabel: {
    alignSelf: 'flex-start', // Textコンポーネント自体を左寄せに
    marginLeft: 20, // 左から20pxの位置に配置
    marginBottom: 3, // TextInputとの間隔
  },
  textLabelRow: {
    width: 120,
    marginLeft: 20, // 左から20pxの位置に配置
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
  },
  // container: {
  //     flex: 1,
  //     alignItems: 'center',
  //     justifyContent: 'flex-start',
  //     paddingTop: 20,
  // },
  closeButton: {
    marginRight: 20,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    marginBottom: 20,
  },
  imageUploadContainer: {
    width: 200,
    height: 200,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 8,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default PublishScreen;
