import {View, TouchableOpacity, Text, ScrollView } from 'react-native';

export function Categories({onChange, selections, categories}) {
    return(
        <>
        <Text style={{fontSize:25, fontWeight:'bold'}}>ORDER FOR DELIVERY!</Text>
            <ScrollView bounces={true} horizontal={true}>
            {categories.map((category, index) => (
                <TouchableOpacity
                  onPress={() => {
                    onChange(index);
                  }}
                  style={{
                    flex: 1 / category.length,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 16,
                    backgroundColor: selections[index] ? '#495E57' : '#c7ddb5',
                    borderWidth: 2,
                    width: 90,
                    margin: 20,
                    height: 50,
                    borderRadius: 20, 
                  }}>
                  <View>
                    <Text style={{ color: selections[index] ? '#F4CE14' : 'black', fontWeight:'bold'}}>
                      {category}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
        </>
    )
}