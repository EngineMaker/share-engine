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
  SafeAreaView,
} from 'react-native';
import {NumberInput, CustomButton} from '../components/SmallComponents';
import {postNewItemRequest} from '../Utils';
import {UploadImages} from '../components/UploadImages';
import Carousel from 'react-native-reanimated-carousel';
import g_styles from '../Styles';

const registerButtonIcon = require('../images/registerButton.png');

const PublishScreen = ({navigation}: {navigation: any}) => {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [caution, setCaution] = useState('');
  const [maxLoanDays, setMaxLoanDays] = useState('');
  const [loanAmount, setLoanAmount] = useState('');

  const [imageUris, setImageUris] = useState<string[] | null>(null);
  const daysArray = Array.from({length: 30}, (_, i) => i + 1);

  const saveItem = async () => {
    // 画像
    // アイテム名
    // 説明文
    // 注意事項
    // 貸出日数上限
    // 貸出金額
    const body = {
      name: itemName,
      price: loanAmount,
      description: description,
      precaution: caution,
      group_ids: ['1'],
    };
    console.log('item:', body);
    const response = await postNewItemRequest(body)
      .then(res => {
        console.log('Posted new item:', res);
        navigation.navigate('Home');
      })
      .catch(error => {
        console.error('Error posting new item:', error);
      });
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <Text style={styles.headerText}>アイテムの編集</Text>

        {/* 画像登録エリア */}
        <UploadImages images={imageUris} setImages={setImageUris} />

        {/* アイテム名入力 */}

        <Text style={styles.textLabel}>アイテム名</Text>
        <TextInput
          style={[styles.input, styles.inputColor]}
          value={itemName}
          onChangeText={setItemName}
          placeholder="アイテム名を入力"
        />

        {/* 説明文入力 */}
        <Text style={styles.textLabel}>説明文</Text>
        <TextInput
          style={[styles.input, styles.inputColor, {height: 84}]}
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
          style={[styles.input, styles.inputColor, {height: 84}]}
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
          <Carousel
            loop={false}
            width={80}
            height={40}
            snapEnabled={true}
            vertical={true}
            style={[
              styles.inputColor,
              {marginRight: 10, borderRadius: 5, borderWidth: 1},
            ]}
            data={daysArray}
            defaultIndex={0}
            onSnapToItem={index => setMaxLoanDays(index + 1 + '日')}
            scrollAnimationDuration={200}
            renderItem={({item}) => (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={[g_styles.cardText, {textAlign: 'center'}]}
                  selectable={false}>
                  {item}日
                </Text>
              </View>
            )}
          />
        </View>

        <View style={styles.border} />

        {/* 貸出金額入力 */}
        <View style={styles.row}>
          <Text style={styles.textLabelRow}>貸出金額</Text>
          <NumberInput
            value={'¥' + loanAmount}
            onChangeText={text => setLoanAmount(text.replace(/¥/g, ''))}
            placeholder="¥300"
            style={[styles.input, styles.inputColor]}
          />
        </View>

        <TouchableOpacity onPress={saveItem}>
          <Image
            source={registerButtonIcon}
            style={styles.registerButtonImage}
          />
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: 'white',
                fontSize: 20,
                fontWeight: 'bold',
              }}>
              登録する
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  registerButtonImage: {
    width: 160,
    height: 55,
    resizeMode: 'cover',
    alignSelf: 'center',
  },

  background: {
    backgroundColor: '#cccccc',
    paddingVertical: 10,
    marginHorizontal: -30,
    // iOS用の影設定
    shadowOffset: {width: 0, height: 2},
    shadowColor: '#333',
    shadowRadius: 4,
    shadowOpacity: 0.8,
    // Android用の影設定
    elevation: 5,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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
  closeButton: {
    marginRight: 20,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    marginBottom: 20,
    marginLeft: 20,
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
    borderRadius: 5,
  },
  inputColor: {
    borderColor: '#ccc',
    backgroundColor: '#ededed',
  },
});

export default PublishScreen;
