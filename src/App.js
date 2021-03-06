import React, { useEffect, useState} from "react";
import api from './services/api'

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function App() {

  const [projects, setProjects] =  useState([]);
  const [Refresh, setRefresh] =  useState(true);

  useEffect(() => {
      api.get('/repositories').then(request => {
          console.log(request.data);
          setProjects(request.data);
          setRefresh(false);
      }).catch((error)=>{
        console.log("Api call error", error);
        alert(error.message);
     });
  }, []);


  async function handleLikeRepository(id) {
    // Implement "Like Repository" functionality 
    setRefresh(true);
    const request = await api.post(`/repositories/${id}/like`);
    const projectindex = projects.findIndex(project => project.id === id);
    if (projectindex >= 0){
      projects[projectindex] = request.data;
      setProjects(projects);
      setRefresh(false);
    }
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
     
      <FlatList 
        data={projects}
        keyExtractor={project => project.id}
        extraData={projects}
        renderItem={({ item: project }) => (

        <View key={project.id} style={styles.repositoryContainer}>
        
              <Text style={styles.repository} > { project.title }</Text>
         
          <View style={styles.techsContainer}>

          { project.techs.map(tech => (
                 <Text key={tech} style={styles.tech}>{tech}</Text>
           ))}
          </View>

          <View style={styles.likesContainer}>
            <Text
              style={styles.likeText}
              // Remember to replace "1" below with repository ID: {`repository-likes-${repository.id}`}
              testID={`repository-likes-${project.id}`}
            >
              { project.likes } curtidas
            </Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleLikeRepository(project.id)}
            // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
            testID={`like-button-${project.id}`}
          >
            <Text style={styles.buttonText}>Curtir</Text>
          </TouchableOpacity>
        </View>

       )}
      refreshing={true}
      onRefresh={Refresh}
      /> 
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 5,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
    borderRadius:10
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: "#7159c1",
    height:50,
    justifyContent:"center",
    alignItems:"center"
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
   
    padding: 15,
  },
});


