using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddStudentsData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
			migrationBuilder.InsertData(
				table: "Students",
				columns: new[] { "Name", "Surname", "Lastname", "Email" },
				values: new object[,]
				{
					{ "Иван", "Фёдоров", "Михайлович", "imfyodorov@mail.ru" },
					{ "Екатерина", "Орлова", "Евгеньевна", "eeorlova@mail.ru" },          
					{ "Иван", "Кузнецов", "Сидорович", "iskuznetsov@mail.ru" },           
					{ "Светлана", "Кузнецова", "Павловна", "spkuznetsova@mail.ru" },      
					{ "Павел", "Сидоров", "Евгеньевич", "pesidorov@mail.ru" },            
					{ "Екатерина", "Григорьева", "Александровна", "eagrigoreva@mail.ru" },
					{ "Татьяна", "Лебедева", "Петровна", "tplebedeva@mail.ru" },          
					{ "Екатерина", "Сидорова", "Павловна", "epsidorova@mail.ru" },        
					{ "Сергей", "Соловьёв", "Григорьевич", "sgsolovyov@mail.ru" },        
					{ "Наталья", "Баранова", "Алексеевна", "nabaranova@mail.ru" },        
					{ "Юлия", "Тихонова", "Владимировна", "yvtikhonova@mail.ru" },        
					{ "Татьяна", "Попова", "Григорьевна", "tgpopova@mail.ru" },           
					{ "Анастасия", "Попова", "Николаевна", "anpopova@mail.ru" },          
					{ "Елена", "Мельникова", "Александровна", "eamelnikova@mail.ru" },    
					{ "Наталья", "Кузнецова", "Сергеевна", "nskuznetsova@mail.ru" },      
					{ "Ольга", "Григорьева", "Анатольевна", "oagrigoreva@mail.ru" },      
					{ "Владимир", "Кузнецов", "Игоревич", "vikuznetsov@mail.ru" },        
					{ "Светлана", "Тихонова", "Юрьевна", "sytikhonova@mail.ru" },         
					{ "Анна", "Смирнова", "Михайловна", "amsmirnova@mail.ru" },           
					{ "Сергей", "Ермаков", "Сидорович", "ssermakov@mail.ru" },            
					{ "Елена", "Тимофеева", "Сидоровна", "estimofeeva@mail.ru" },         
					{ "Татьяна", "Петрова", "Дмитриевна", "tdpetrova@mail.ru" },          
					{ "Ольга", "Баранова", "Анатольевна", "oabaranova@mail.ru" },         
					{ "Татьяна", "Григорьева", "Николаевна", "tngrigoreva@mail.ru" },     
					{ "Александр", "Иванов", "Сергеевич", "asivanov@mail.ru" },           
					{ "Сергей", "Кузнецов", "Иванович", "sikuznetsov@mail.ru" },          
					{ "Сергей", "Лебедев", "Петрович", "splebedev@mail.ru" },             
					{ "Татьяна", "Ермакова", "Дмитриевна", "tdermakova@mail.ru" },        
					{ "Артем", "Петров", "Денисович", "adpetrov@mail.ru" },               
					{ "Павел", "Ковалёв", "Владимирович", "pvkovalyov@mail.ru" },         
					{ "Ольга", "Степанова", "Евгеньевна", "oestepanova@mail.ru" },        
					{ "Екатерина", "Баранова", "Павловна", "epbaranova@mail.ru" },        
					{ "Иван", "Орлов", "Григорьевич", "igorlov@mail.ru" },                
					{ "Александр", "Григорьев", "Александрович", "aagrigorev@mail.ru" },  
					{ "Роман", "Мельников", "Викторович", "rvmelnikov@mail.ru" },         
					{ "Екатерина", "Смирнова", "Дмитриевна", "edsmirnova@mail.ru" },
					{ "Роман", "Ромашов", "Александрович", "raromashov@mail.ru" },
					{ "Светлана", "Тихонова", "Анатольевна", "satikhonova@mail.ru" },
					{ "Ольга", "Петрова", "Дмитриевна", "odpetrova@mail.ru" },
					{ "Екатерина", "Тихонова", "Евгеньевна", "eetikhonova@mail.ru" },
					{ "Екатерина", "Степанова", "Денисовна", "edstepanova@mail.ru" },
					{ "Александр", "Григорьев", "Сергеевич", "asgrigorev@mail.ru" },
					{ "Максим", "Тимофеев", "Сидорович", "mstimofeev@mail.ru" },
					{ "Елена", "Смирнова", "Станиславовна", "essmirnova@mail.ru" },
					{ "Артем", "Сидоров", "Анатольевич", "aasidorov@mail.ru" },
				});
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
