import { useState } from 'react';
import {useNavigation} from '@react-navigation/native'
import {FlatList, Heading, HStack, IconButton, Text, useTheme, VStack, Center } from 'native-base';
import { SignOut, ChatTeardropText } from 'phosphor-react-native';
import Logo from '../assets/logo_secondary.svg';
import { Filter } from '../components/Filter';
import {Order, OrderProps} from '../components/Order';
import { Button } from '../components/Button';

export function Home() {

    const [statusSelected, setStatusSelect] = useState<'open' | 'closed'>('open');
    const [orders, setOrders] = useState<OrderProps[]>([
        {
        id: '1',
        patrimony: '1',
        when: '19/07/2022 às 04:18',
        status: 'open'
        }

    ]);

    const { colors } = useTheme();
    const  navigation  = useNavigation();

    function handleNewOrder(){
        navigation.navigate('register');
    }

    function handleOpenDetails(orderId: string){
        navigation.navigate('details', {orderId}); 
    }


    return (
        <VStack flex={1} pb={6} bg="gray.700">
            <HStack w="full" justifyContent="space-between"
                alignItems="center" bg="gray.600"
                pt={12} pb={5} px={6}>

                <Logo />

                <IconButton
                    icon={<SignOut size={26} color={colors.gray[300]} />}
                />
            </HStack>

            <VStack flex={1} px={6}>
                <HStack w="full" mt={8} mb={4} justifyContent="space-between" alignItems="center">
                    <Heading color="gray.100">
                        Solicitações
                    </Heading>
                    <Text color="gray.200">
                        3
                    </Text>
                </HStack>


                <HStack space={3} mb={8} >
                    <Filter title='em andamento' type='open' onPress={() => setStatusSelect('open')} isActive={statusSelected === 'open'} />
                    <Filter title='finalizados' type='closed' onPress={() => setStatusSelect('closed')} isActive={statusSelected === 'closed'}/>
                </HStack>

                <FlatList data={orders} keyExtractor={item => item.id}
                    renderItem={({item}) => <Order data={item} onPress={ () => handleOpenDetails(item.id)} />}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom:50
                    }}
                    ListEmptyComponent={() => (
                        <Center>
                            <ChatTeardropText color={statusSelected === 'open' ? colors.secondary[700] : colors.green[300]} size={50} />
                            <Text color="white" fontSize="xl" mt={6} textAlign="center" >
                                Você ainda não possui {'\n'}
                                solicitações {statusSelected === 'open' ? 'em andamento' : 'finalizadas'}
                            </Text>
                        </Center>
                    )}
                />


                <Button title="Nova Solictação" onPress={handleNewOrder}/>

            </VStack>
        </VStack>
    );
}