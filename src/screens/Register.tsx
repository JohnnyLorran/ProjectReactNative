import { VStack } from 'native-base';
import { useState } from 'react';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export function Register() {
    const [isLoading, setIsLoading] = useState(false);
    const [patrimony, setPatrimony] = useState('');
    const [description, setDescription] = useState('');
    const navigation = useNavigation();

    function handleNewOrderRegister(){
        if (!patrimony || !description) {
            return Alert.alert('Nova solicitação', 'Preencha todos os campos.');
        }


        setIsLoading(true);

        firestore().collection('orders').add({
            patrimony,
            description,
            status: 'open',
            created_at: firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            Alert.alert('Nova solicitação', 'Registrada com sucesso.');
            navigation.goBack();
        })
        .catch((error) => {
            console.log(error);
            setIsLoading(false);
            return Alert.alert('Nova solicitação', 'Não foi possível realizar o cadastro.');
        })
    }


    return (
        <VStack flex={1} p={6} bg="gray.600">

            <Header title ="Nova solictação" />

            <Input placeholder="Número do patrimônio" mt={5}  onChangeText={setPatrimony}/>

            <Input placeholder="Descrição do problema"  onChangeText={setDescription}
                flex={1} mt={5} multiline textAlignVertical="top"
            />

            <Button title="Cadastrar" mt={5}  onPress={handleNewOrderRegister} isLoading={isLoading} />

        </VStack>
    );
}